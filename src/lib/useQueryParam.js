import { useLocation } from 'react-router-dom';

export default function useQueryParam(param) {

  const { search } = useLocation();

  // Get the query string without the leading '?' character
  const queryString = search.substring(1); 

  // Split on '&' to get an array of pairs
  const queryParams = queryString.split('&');

  // Find the param value
  const paramValue = queryParams.find(p => p.startsWith(param + '='))?.split('=')[1];

  return paramValue;

}