import { Link } from "react-router-dom";
import { Package, Boxes } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Boxes className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Eston Technologies{" "}
              </h1>
              <p className="text-sm text-muted-foreground">
                Manufacturing Management
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Eston Technologies
          </h2>
          <p className="text-lg text-muted-foreground">
            Track raw materials and products with ease. Simple, efficient,
            organized.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Raw Material Card */}
          <Link
            to="/raw-material"
            className="group block p-8 bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in"
          >
            <div className="h-14 w-14 rounded-xl bg-accent flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
              <Package className="h-7 w-7 text-accent-foreground group-hover:text-primary-foreground transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Add Raw Material
            </h3>
            <p className="text-muted-foreground">
              Register new raw materials, track inventory levels and supplier
              information.
            </p>
          </Link>

          {/* Product Card */}
          <Link
            to="/product"
            className="group block p-8 bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="h-14 w-14 rounded-xl bg-accent flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
              <Boxes className="h-7 w-7 text-accent-foreground group-hover:text-primary-foreground transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Add Product
            </h3>
            <p className="text-muted-foreground">
              Create products, define assembly requirements and link raw
              materials.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
