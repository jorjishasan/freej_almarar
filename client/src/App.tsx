import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { NavHistoryProvider } from "./context/NavHistoryContext";
import RouteTracker from "./components/RouteTracker";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AdminExport from "./pages/AdminExport";
import Archives from "./pages/Archives";
import ArchiveDetail from "./pages/ArchiveDetail";
import Photos from "./pages/Photos";
import Events from "./pages/Events";
import Poems from "./pages/Poems";
import Books from "./pages/Books";
import Reposts from "./pages/Reposts";
import Documents from "./pages/Documents";
import ArchiveHub from "./pages/ArchiveHub";
import Ferjan from "./pages/Ferjan";
import Figures from "./pages/Figures";
import Poets from "./pages/Poets";
import LoadingPage from "./pages/Loading";
import FamilyTree from "./pages/FamilyTree";
import FamilyTreeSection from "./pages/FamilyTreeSection";
import FamilyTreeFamily from "./pages/FamilyTreeFamily";

function Redirect({ to }: { to: string }) {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation(to);
  }, [to, setLocation]);
  return null;
}
import History from "./pages/History";
import Collaborations from "./pages/Collaborations";
import About from "./pages/About";
import Contribute from "./pages/Contribute";
import OurProjects from "./pages/OurProjects";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/admin/export"} component={AdminExport} />
      
      {/* Tier 1 Sections */}
      <Route path={"/history"} component={History} />
      <Route path={"/history/:slug"} component={ArchiveDetail} /> {/* TODO: Create HistoryDetail */}
      
      <Route path={"/archive"} component={ArchiveHub} />
      <Route path={"/archive/documents"} component={Documents} />
      <Route path={"/archive/documents/:slug"} component={ArchiveDetail} />
      <Route path={"/archive/photographs"} component={Photos} />
      <Route path={"/archive/photographs/:slug"} component={ArchiveDetail} /> {/* TODO: Create PhotoDetail */}
      
      <Route path={"/ferjan"} component={Ferjan} />
      <Route path={"/ferjan/:slug"} component={ArchiveDetail} /> {/* TODO: Create FerjanDetail */}
      
      {/* Family Tree (Tier 1) */}
      <Route path={"/family-tree"} component={FamilyTree} />
      <Route path={"/family-tree/:sectionId"} component={FamilyTreeSection} />
      <Route path={"/family-tree/:sectionId/:familyId"} component={FamilyTreeFamily} />

      {/* Figures (Tier 1) */}
      <Route path={"/figures"} component={Figures} />
      <Route path={"/figures/:slug"} component={ArchiveDetail} /> {/* TODO: Create FigureDetail */}

      {/* Poets (Tier 1) */}
      <Route path={"/poets"} component={Poets} />
      <Route path={"/loading"} component={LoadingPage} />

      {/* Legacy lineage URLs - redirect to new paths */}
      <Route path={"/lineage"}>
        <Redirect to="/family-tree" />
      </Route>
      <Route path={"/lineage/figures"}>
        <Redirect to="/figures" />
      </Route>
      
      <Route path={"/poems"} component={Poems} />
      <Route path={"/poems/:slug"} component={ArchiveDetail} /> {/* TODO: Create PoemDetail */}
      
      {/* Tier 2 Sections */}
      <Route path={"/reposts"} component={Reposts} />
      <Route path={"/reposts/:slug"} component={ArchiveDetail} /> {/* TODO: Create RepostDetail */}
      
      <Route path={"/events"} component={Events} />
      <Route path={"/events/:slug"} component={ArchiveDetail} /> {/* TODO: Create EventDetail */}
      
      <Route path={"/collaborations"} component={Collaborations} />
      <Route path={"/collaborations/:slug"} component={ArchiveDetail} /> {/* TODO: Create CollaborationDetail */}
      
      <Route path={"/books"} component={Books} />
      <Route path={"/books/:slug"} component={ArchiveDetail} /> {/* TODO: Create BookDetail */}
      
      {/* Tier 3 Sections */}
      <Route path={"/about"} component={About} />
      <Route path={"/contribute"} component={Contribute} />
      <Route path={"/our-projects"} component={OurProjects} />
      
      {/* Legacy routes */}
      <Route path={"/archives"} component={Archives} />
      <Route path={"/archives/:slug"} component={ArchiveDetail} />
      <Route path={"/photos"} component={Photos} />
      
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        switchable
      >
        <LanguageProvider>
          <NavHistoryProvider>
            <RouteTracker />
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </NavHistoryProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
