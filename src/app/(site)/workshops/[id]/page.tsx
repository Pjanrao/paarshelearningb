import { notFound } from "next/navigation";
import { workshops } from "@/lib/workshops";
import { Metadata } from "next";
import WorkshopDetailContent from "./WorkshopDetailContent";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const workshop = (workshops as any)[id];

  if (!workshop) {
    return {
      title: "Workshop Not Found | Paarsh E-Learning",
    };
  }

  return {
    title: `${workshop.title} | Paarsh E-Learning Workshops`,
    description: workshop.subtitle,
  };
}

const WorkshopDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const workshop = (workshops as any)[id];

  if (!workshop) {
    notFound();
  }

  return <WorkshopDetailContent workshop={workshop} />;
};

export default WorkshopDetailPage;
