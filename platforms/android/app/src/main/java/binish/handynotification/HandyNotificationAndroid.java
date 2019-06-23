package binish.handynotification;

import android.os.Looper;
import android.util.Log;
import android.widget.Toast;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

import binish.handynotification.Controller.Check;

import static binish.handynotification.Controller.Check.checkNULL;

/**
 * This class echoes a string called from JavaScript.
 */
public class HandyNotificationAndroid extends CordovaPlugin {
    static String AUTH_KEY_FCM;
    static String API_URL_FCM = "https://fcm.googleapis.com/fcm/send";


    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("pushNotification")) {
            String finalKey = args.getString(0);
            String topic = args.getString(1);
            String title = args.getString(2);
            String message = args.getString(3);
            String androidChannelID = args.getString(4);
            String image = args.getString(5);
            String icon = args.getString(6);
            String soundName = args.getString(7);
            String style = args.getString(8);
            String picture = args.getString(9);
            String summaryText = args.getString(10);
            String notID = args.getString(11);
            String priority = args.getString(12);
            JSONArray vibrationPattern = args.getJSONArray(13);
            JSONArray ledColor = args.getJSONArray(14);

            Log.i("pushNotification","Title:"+title+" Message:"+message+" Image:"+image);

            Check check = new Check(this.cordova.getActivity());

            AUTH_KEY_FCM = finalKey;
            cordova.getThreadPool().execute(() -> {
                try {
                    this.pushNotification(topic,title,message,androidChannelID,check.checkImage(image),check.checkIcon(icon),soundName,style,
                            check.checkPicture(picture),check.checkSummaryText(summaryText),check.checkNotID(notID),priority,check.checkVibrationPattern(vibrationPattern),
                            check.checkLedColor(ledColor), callbackContext);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            });
            return true;
        }
        return false;
    }

    private void pushNotification
            (String topic,String title,String message,String androidChannelID,String image,String icon,
             String soundName,String style,String picture,
             String summaryText,int notID,String priority,JSONArray vibrationPattern,JSONArray ledColor, CallbackContext callbackContext) throws IOException {

        if(notID==-1) {
            callbackContext.error("Invalid notID");
            return;
        }
        String result = "";
        URL url = new URL(API_URL_FCM);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setUseCaches(false);
        conn.setDoInput(true);
        conn.setDoOutput(true);

        conn.setRequestMethod("POST");
        conn.setRequestProperty("authorization", "key=" + AUTH_KEY_FCM);
        conn.setRequestProperty("content-type", "application/json");

        JSONObject json = new JSONObject();
        try {
            json.put("to", topic);
            JSONObject data = new JSONObject();
            data.put("title", title); // Notification title
            data.put("message", message); // Notification
            data.put("android_channel_id", androidChannelID);
            data.put("soundname", soundName);
            data.put("priority", priority);
            data.put("notId", notID);


            if(!icon.equals(checkNULL))
                data.put("icon", icon);

            if(!image.equals(checkNULL)) {
                data.put("image", image);
                data.put("image-type", "circular");
            }

            if(!picture.equals(checkNULL)){
                data.put("style",style);
                data.put("picture",picture);
                if(!summaryText.equals(checkNULL)) {
                    data.put("summaryText", summaryText);
                }
            }
            if(!(vibrationPattern.get(0).equals("0") && vibrationPattern.get(1).equals("0")
                    && vibrationPattern.get(2).equals("0") && vibrationPattern.get(3).equals("0")))
                data.put("vibrationPattern","["+vibrationPattern.get(0)+","+vibrationPattern.get(1)+","+vibrationPattern.get(2)+","+vibrationPattern.get(3)+"]");

            if(!(ledColor.get(0).equals("0") && ledColor.get(1).equals("0")
                    && ledColor.get(2).equals("0") && ledColor.get(3).equals("0")))
                data.put("ledColor","["+ledColor.get(0)+","+ledColor.get(1)+","+ledColor.get(2)+","+ledColor.get(3)+"]");

            // body
            json.put("data", data);

            OutputStreamWriter wr = new OutputStreamWriter(
                    conn.getOutputStream());
            wr.write(json.toString());
            wr.flush();

            BufferedReader br = new BufferedReader(new InputStreamReader(
                    (conn.getInputStream())));

            String output;
            System.out.println("Output from Server .... \n");
            while ((output = br.readLine()) != null) {
                System.out.println(output);
            }
            callbackContext.success(result);
        } catch (Exception e) {
            e.printStackTrace();
            callbackContext.error(result);
        }
        System.out.println("GCM Notification is sent successfully");
    }
}
