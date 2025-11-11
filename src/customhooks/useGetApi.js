import { useState, useEffect } from "react";
import axios from "axios";

export const useGetApi = (url, headers = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(url, { headers });
      setData(response.data);
    } catch (err) {
      setError(err.response?.data || { message: "Something went wrong" });
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]); 

  return { data, loading, error, fetchData };
};
