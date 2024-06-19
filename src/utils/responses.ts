export const errorResponse = (statusCode: number, message: string) => {
  return {
    statusCode,
    body: JSON.stringify({
      status: "error",
      message,
    }),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
};

export const successResponse = () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      status: "success",
      message: "Signal Processed",
    }),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  };
};
