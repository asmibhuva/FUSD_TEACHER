import { API } from "aws-amplify";
import * as queries from "./Queries";

export const getDashboardData = (values) => {
  // console.log("values - ", values)
  return API.graphql({ query: queries.getDashboardDataQuery(values) });
};
