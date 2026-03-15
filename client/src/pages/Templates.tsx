import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { templates, categories, colorThemes, Template, TemplateLayout } from "@/lib/templates";
import { TemplateThumbnail } from "@/components/ResumeRender";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Check, ArrowRight, SlidersHorizontal, X } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const LAYOUTS: { id: TemplateLayout; label: string }[] = [
  { id: "sidebar-left", label: "Sidebar Left" },
  { id: "sidebar-right", label: "Sidebar Right" },
  { id: "classic-single", label: "Classic" },
  { id: "two-column", label: "Two Column" },
  { id: "top-bar", label: "Top Bar" },
  { id: "minimal", label: "Minimal" },
  { id: "bold-header", label: "Bold Header" },
  { id: "infographic", label: "Infographic" },
  { id: "executive", label: "Executive" },
  { id: "creative-split", label: "Creative Split" },
];

const PAGE_SIZE = 30;

export default function Templates() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLayout, setSelectedLayout] = useState<TemplateLayout | "all">("all");
  const [selectedTheme, setSelectedTheme] = useState(colorThemes[0]);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchSearch =
        !search ||
        t.profession.toLowerCase().includes(search.toLowerCase()) ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === "All" || t.category === selectedCategory;
      const matchLayout = selectedLayout === "all" || t.layout === selectedLayout;
      return matchSearch && matchCategory && matchLayout;
    });
  }, [search, selectedCategory, selectedLayout]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  const clear = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedLayout("all");
    setPage(1);
  };

  const activeFilters =
    (selectedCategory !== "All" ? 1 : 0) + (selectedLayout !== "all" ? 1 : 0) + (search ? 1 : 0);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              Template Gallery
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            {templates.length}+ professional templates for every career — fully editable
          </p>
        </div>

        {/* Search + Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by profession, e.g. Graphic Designer..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
              data-testid="input-search-templates"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="relative">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {activeFilters > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                {activeFilters}
              </span>
            )}
          </Button>
          {activeFilters > 0 && (
            <Button variant="ghost" size="sm" onClick={clear} className="text-muted-foreground">
              <X className="w-3 h-3 mr-1" /> Clear
            </Button>
          )}
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="bg-muted/30 rounded-xl p-5 mb-6 border space-y-5">
            {/* Category */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Category</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setPage(1); }}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-muted-foreground hover:border-primary hover:text-primary"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Style */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Layout Style</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setSelectedLayout("all"); setPage(1); }}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                    selectedLayout === "all"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border text-muted-foreground hover:border-primary hover:text-primary"
                  )}
                >
                  All Styles
                </button>
                {LAYOUTS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => { setSelectedLayout(l.id); setPage(1); }}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                      selectedLayout === l.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-muted-foreground hover:border-primary hover:text-primary"
                    )}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Color */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Preview Color</p>
              <div className="flex gap-3 flex-wrap">
                {colorThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme)}
                    title={theme.name}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                      selectedTheme.id === theme.id ? "border-gray-800 scale-110" : "border-transparent"
                    )}
                    style={{ backgroundColor: theme.hex }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filtered.length}</span> templates found
          </p>
          <Link href="/create">
            <Button size="sm" className="shadow-md shadow-primary/20">
              Start with AI <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Template Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed rounded-2xl">
            <p className="text-2xl font-bold text-muted-foreground mb-2">No templates found</p>
            <p className="text-muted-foreground">Try a different search or clear filters</p>
            <Button variant="outline" className="mt-4" onClick={clear}>Clear all filters</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {paginated.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setPreviewTemplate(template)}
                  className={cn(
                    "group cursor-pointer rounded-xl border-2 overflow-hidden bg-white hover:border-primary transition-all hover:shadow-lg hover:-translate-y-0.5",
                    previewTemplate?.id === template.id ? "border-primary ring-2 ring-primary/30" : "border-border"
                  )}
                  data-testid={`template-card-${template.id}`}
                >
                  <div className="relative overflow-hidden bg-gray-50">
                    <TemplateThumbnail layout={template.layout} theme={selectedTheme} name={template.profession} />
                    {previewTemplate?.id === template.id && (
                      <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                        <div className="bg-primary text-primary-foreground rounded-full p-2">
                          <Check className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-2.5 border-t bg-white">
                    <p className="text-xs font-semibold text-foreground truncate">{template.profession}</p>
                    <p className="text-[10px] text-muted-foreground capitalize truncate mt-0.5">
                      {template.layout.replace(/-/g, " ")}
                    </p>
                    <Badge variant="secondary" className="mt-1.5 text-[9px] h-4 px-1.5">
                      {template.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-10">
                <Button variant="outline" onClick={() => setPage(p => p + 1)} size="lg">
                  Load More Templates ({filtered.length - paginated.length} remaining)
                </Button>
              </div>
            )}
          </>
        )}

        {/* Preview Panel (sticky bottom) */}
        {previewTemplate && (
          <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t shadow-2xl z-50 px-4 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-foreground">{previewTemplate.profession}</p>
                <p className="text-sm text-muted-foreground">{previewTemplate.description} · {previewTemplate.category}</p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <Button variant="ghost" size="sm" onClick={() => setPreviewTemplate(null)}>
                  <X className="w-4 h-4 mr-1" /> Dismiss
                </Button>
                <Link href={`/create?template=${previewTemplate.id}`}>
                  <Button size="sm" className="shadow-md shadow-primary/20">
                    Use This Template <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
