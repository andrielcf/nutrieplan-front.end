import axios from "axios";
import { useEffect, useState } from "react";

axios.defaults.baseURL = "http://localhost:8080/api";

export const useAxios = (params) => {
  const [axiosParams, setAxiosParams] = useState(params || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState([]);

  const fetchData = async () => {
    await axios
      .request(axiosParams)
      .then((res) => {
        setError("");
        setLoading(true)
        console.log("response: ", res.data);
        setResponse(res);
      })
      .catch((err) => {
        setError("Ocorreu um erro inesperado");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!axiosParams) {
      return;
    }
    console.log("request: ", axiosParams);
    fetchData();
  }, [axiosParams]);

  return [{ response, error, loading }, setAxiosParams];
};