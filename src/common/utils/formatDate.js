import { format } from "date-fns";

export const formatDate = (timestamp) => format(timestamp, "LLLL d, y");
