import { SerializableError } from "@/types";
import React from "react";

interface PageErrorProps {
  error: SerializableError["error"];
}

const PageError = ({
  error
}: PageErrorProps) => {
  return (
    <div className="text-gray700_light850 py-4">
      {error.message ?? "There was an error while fetching data"}
    </div>
  );
}

export const handleErrors = (fetchResponse: any[]): React.ReactElement | null => {
  const error = fetchResponse.find((response) => response.error)?.error;

  if (error) {
    return <PageError error={error} />;
  }

  return null;
};