import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../user/UserContext";
import { useUserData } from "../context/UserDataContext";

export const VideoDataContext = createContext();

export const VideoDataProvider = ({ children }) => {
  const [exerciseData, setExerciseData] = useState([]);
  const { userData } = useUserData();
  const { user } = useContext(UserContext);
  const [shouldRefetch, _refetch] = useState(true);
  const resetSearchVideoData = () => _refetch((prev) => !prev);
  // BUGFIX: Search wird zurückgesetzt 22.08

  useEffect(() => {
    if (user !== null) {
      const exercisesFromDB = async () => {
        try {
          const response = await axios.get("/api/exercises");
          setExerciseData(response);
        } catch (error) {
          console.error("Error fetching Exercises data:", error);
        }
      };
      exercisesFromDB();
    }
  }, [user, shouldRefetch]);

  useEffect(() => {
    if (exerciseData) {
      sessionStorage.setItem(
        "sessionedExerciseData",
        JSON.stringify(exerciseData)
      );
    }
  }, [exerciseData, shouldRefetch]);
  return (
    <VideoDataContext.Provider
      value={{ exerciseData, setExerciseData, resetSearchVideoData }}
    >
      {children}
    </VideoDataContext.Provider>
  );
};
