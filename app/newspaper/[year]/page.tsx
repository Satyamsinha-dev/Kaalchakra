import { Suspense } from "react";
import NewspaperRoute from "../../../components/NewspaperRoute";

export default function NewspaperPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-ivory" />}>
      <NewspaperRoute />
    </Suspense>
  );
}