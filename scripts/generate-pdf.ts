/**
 * Script untuk generate PDF dari semua halaman website
 * 
 * Cara pakai:
 * 1. Jalankan dev server: bun run dev
 * 2. Di terminal lain: bun run scripts/generate-pdf.ts
 * 
 * Options:
 * --combined  : Gabungkan semua halaman jadi 1 PDF
 * --locale=id : Pilih locale (default: id)
 */

import puppeteer, { type PDFOptions, type Browser } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

// Konfigurasi
const CONFIG = {
    baseUrl: 'http://localhost:3000',
    outputDir: './pdf-output',
    locale: 'id', // default locale
    viewport: {
        width: 1920,  // Desktop width
        height: 1080, // Desktop height
    },
    pdfOptions: {
        format: 'A4',
        landscape: true, // Landscape untuk desktop layout
        printBackground: true,
        margin: {
            top: '10mm',
            bottom: '10mm',
            left: '10mm',
            right: '10mm',
        },
    } satisfies PDFOptions,
};

// Daftar semua halaman yang akan di-render
const PAGES = [
    { path: '/', name: 'beranda', title: 'Beranda' },
    { path: '/tentang-kami', name: 'tentang-kami', title: 'Tentang Kami' },
    { path: '/layanan', name: 'layanan', title: 'Layanan' },
    { path: '/portofolio', name: 'portofolio', title: 'Portofolio' },
    { path: '/artikel', name: 'artikel', title: 'Artikel' },
    { path: '/kontak', name: 'kontak', title: 'Kontak' },
];

// Parse arguments
function parseArgs() {
    const args = process.argv.slice(2);
    return {
        combined: args.includes('--combined'),
        locale: args.find(arg => arg.startsWith('--locale='))?.split('=')[1] || CONFIG.locale,
    };
}

// Ensure output directory exists
function ensureOutputDir() {
    if (!fs.existsSync(CONFIG.outputDir)) {
        fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }
}

// Generate PDF untuk single page
async function generateSinglePDF(
    browser: Browser,
    pagePath: string,
    outputName: string,
    locale: string
) {
    const page = await browser.newPage();

    // Set viewport untuk desktop layout
    await page.setViewport(CONFIG.viewport);

    const url = `${CONFIG.baseUrl}/${locale}${pagePath}`;
    console.log(`📄 Rendering: ${url}`);

    try {
        // Navigate ke halaman dan tunggu sampai semua network requests selesai
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 60000
        });

        // Tunggu sebentar untuk animasi selesai
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));

        // Hide elements yang tidak perlu di PDF (optional)
        await page.evaluate(() => {
            // Sembunyikan fixed elements yang mengganggu
            const selectors = [
                '[data-hide-in-pdf]',
                '.cookie-banner',
                '.chat-widget',
            ];
            selectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    (el as HTMLElement).style.display = 'none';
                });
            });
        });

        const outputPath = path.join(CONFIG.outputDir, `${outputName}.pdf`);

        await page.pdf({
            ...CONFIG.pdfOptions,
            path: outputPath,
        });

        console.log(`✅ Generated: ${outputName}.pdf`);
        return outputPath;
    } catch (error) {
        console.error(`❌ Error generating ${outputName}.pdf:`, error);
        throw error;
    } finally {
        await page.close();
    }
}

// Generate semua PDF secara terpisah
async function generateAllPDFs(browser: Browser, locale: string) {
    const results: string[] = [];

    for (const pageInfo of PAGES) {
        const outputPath = await generateSinglePDF(
            browser,
            pageInfo.path,
            pageInfo.name,
            locale
        );
        results.push(outputPath);
    }

    return results;
}

// Main function
async function main() {
    const args = parseArgs();

    console.log('🚀 Starting PDF generation...');
    console.log(`   Locale: ${args.locale}`);
    console.log(`   Combined: ${args.combined ? 'Yes' : 'No'}`);
    console.log('');

    ensureOutputDir();

    // Launch browser
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
        const pdfPaths = await generateAllPDFs(browser, args.locale);

        console.log('');
        console.log('🎉 PDF generation complete!');
        console.log(`📁 Output directory: ${path.resolve(CONFIG.outputDir)}`);
        console.log('');
        console.log('Generated files:');
        pdfPaths.forEach(p => console.log(`   - ${path.basename(p)}`));

        if (args.combined) {
            console.log('');
            console.log('⚠️  Combined PDF feature requires pdf-lib package.');
            console.log('    Install with: bun add pdf-lib');
            console.log('    Then uncomment the combinePDFs function.');
        }
    } catch (error) {
        console.error('💥 Fatal error:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

// Run
main();
