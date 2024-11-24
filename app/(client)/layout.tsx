import { Toaster } from "@/components/ui/toaster";
interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  return (
    <main>
      {children}
      <Toaster />
    </main>
  );
};

export default ClientLayout;
