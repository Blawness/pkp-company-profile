/**
 * Admin root layout. Mounts admin-kit's shell + sidebar and gates the
 * whole /admin tree behind `requireUser()` (redirects to /login if not
 * signed in).
 *
 * Nav items are filtered by the active role via `rbac.filterNav()` —
 * items whose `requires` permission the role lacks are hidden.
 */
import { AdminLayout } from "@blawness/admin-kit/shell";
import { requireUser } from "@blawness/admin-kit/auth-helpers";
import {
  NewspaperIcon,
  ImageIcon,
  FolderIcon,
  UsersIcon,
  UserIcon,
} from "lucide-react";
import { rbac } from "@/rbac";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireUser();
  const role = session.user?.role ?? rbac.config.fallbackRole;

  const navItems = [
    {
      label: "Artikel",
      href: "/admin/articles",
      icon: <NewspaperIcon className="h-4 w-4" />,
      requires: "articles.read",
    },
    {
      label: "Media",
      href: "/admin/media",
      icon: <ImageIcon className="h-4 w-4" />,
      requires: "media.read",
    },
    {
      label: "Kategori",
      href: "/admin/categories",
      icon: <FolderIcon className="h-4 w-4" />,
      requires: "categories.read",
    },
    {
      label: "Pengguna",
      href: "/admin/users",
      icon: <UsersIcon className="h-4 w-4" />,
      requires: "users.read",
    },
    {
      label: "Profil",
      href: "/admin/profile",
      icon: <UserIcon className="h-4 w-4" />,
      requires: "profile.edit",
    },
  ];

  const filteredNav = rbac.filterNav(navItems, role);

  return (
    <AdminLayout navItems={filteredNav} brandName="PKP CMS">
      {children}
    </AdminLayout>
  );
}