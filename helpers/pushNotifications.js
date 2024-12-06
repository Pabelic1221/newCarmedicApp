import { fcmKey } from "../firebase";

export const sendNotification = async (request, status) => {
  const serverKey = fcmKey; // Replace with your server key
  const message = {
    registration_ids: [request.fcmToken],
    to: request.fcmToken, // FCM Token of the recipient
    notification: {
      title: "Request Status",
      body: `Your request has been ${status}!`,
    },
  };

  try {
    const response = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=${serverKey}`,
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error("Failed to send notification");
    }

    console.log("Notification sent successfully!");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
