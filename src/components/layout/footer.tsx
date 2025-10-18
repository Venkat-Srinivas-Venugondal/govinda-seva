export function Footer() {
  return (
    <footer className="bg-card">
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Govinda Seva. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
