import { useEffect } from "react";
import { useLocation } from "wouter";
import { useNavHistory } from "../context/NavHistoryContext";

export default function RouteTracker() {
  const [location] = useLocation();
  const nav = useNavHistory();

  useEffect(() => {
    nav.push(location);
  }, [location]);

  return null;
}
