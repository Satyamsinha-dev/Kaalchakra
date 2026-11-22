import { Suspense } from "react";
import TravelScene from "../../components/TravelScene";

export default function TravelPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-ivory" />}>
      <TravelScene />
    </Suspense>
  );
}