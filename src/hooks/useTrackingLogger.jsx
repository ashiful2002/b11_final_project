import useAxiosSecure from "./useAxiosSecure";
import Swal from "sweetalert2";

const useTrackingLogger = () => {
  const axiosSecure = useAxiosSecure();

  const logTracking = async ({ tracking_id, status, updated_by, details }) => {
    try {
      const payload = {
        tracking_id,
        status,
        details,
        updated_by,
      };
    //   console.log(payload);
      
      await axiosSecure.post("/tracking", payload);
    } catch (error) {
      console.log(error);
    }

    // try {
    //   const res = await axiosSecure.post("/tracking", {
    //     tracking_id,
    //     status,
    //     message,
    //     timestamp: new Date(),
    //   });

    //   if (showToast) {
    //     Swal.fire("Success", "Tracking info added", "success");
    //   }

    //   if (onSuccess) {
    //     onSuccess(res.data);
    //   }
    // } catch (error) {
    //   console.error("Tracking failed:", error);
    //   if (showToast) {
    //     Swal.fire("Error", "Failed to add tracking info", "error");
    //   }
    //   if (onError) {
    //     onError(error);
    //   }
    // }
  };

  return { logTracking };
};

export default useTrackingLogger;
