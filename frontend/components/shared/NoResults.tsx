import { ChartPieIcon } from "@heroicons/react/24/outline";

interface NoResultsProps {
  containerClasses?: string;
  text?: string;
}

const NoResults = ({
  containerClasses,
  text
}: NoResultsProps) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 rounded-lg px-6 py-4 ${containerClasses ?? ""}`}>
      <ChartPieIcon className="size-[108px] text-slate-300 dark:text-light-900" />
      <div className="body-regular text-slate600_light900 text-center">
        {text || "No se encontraron resultados"}
      </div>
    </div>
  );
}

export default NoResults