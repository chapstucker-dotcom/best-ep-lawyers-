import { useLocation } from "react-router-dom";
import NotFound from "./NotFound";
import PracticeAreaTemplate from "../components/PracticeAreaTemplate";
import { getPracticeAreaPageByPath } from "../data/practiceAreaPages";

export default function PracticeAreaPage() {
  const { pathname } = useLocation();
  const page = getPracticeAreaPageByPath(pathname);

  if (!page) {
    return <NotFound />;
  }

  return <PracticeAreaTemplate page={page} />;
}