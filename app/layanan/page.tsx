import { services } from "@/lib/data/services";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";

export default function LayananPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-4xl">
          Layanan
        </h1>
        <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          Layanan utama PT Presisi Konsulindo Prima untuk kebutuhan konsultasi hukum pertanahan dan pengurusan sertifikat tanah.
        </p>
      </div>

      <div className="mt-10 grid gap-8">
        {services.map((service) => (
          <section
            key={service.id}
            id={service.id}
            className="scroll-mt-24 rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950"
          >
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                {service.title}
              </h2>
              <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                {service.description}
              </p>
            </div>

            <div className="mt-6">
              <Accordion type="multiple" className="w-full">
                {service.sections.map((sec) => (
                  <AccordionItem key={sec.title} value={sec.title}>
                    <AccordionTrigger>{sec.title}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="grid gap-2">
                        {sec.items.map((it) => (
                          <li key={it} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-pkp-teal-600" />
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}


