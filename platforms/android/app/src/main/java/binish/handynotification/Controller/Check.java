package binish.handynotification.Controller;

import android.content.Context;
import android.os.Looper;

import org.json.JSONArray;

import nl.xservices.plugins.Toast;

public class Check {
    public static String checkNULL = "NULL";
    public Context context;

    public Check(Context context){
        this.context = context;
    }

    //    soundName,style,picture,summaryText,priority,vibrationPattern,ledColor

//    public String checkSoundName(String soundName){
//        if(soundName.equals("")){
//            soundName="default";
//        }
//        return soundName;
//    }

//    public String checkStyle(String style){
//        if(style.equals("")){
//            style="picture";
//        }
//        return soundName;
//    }

    public String checkImage(String image){
        if(image.equals("")){
            return checkNULL;
        }
        return image;
    }

    public String checkIcon(String icon){
        if (icon.equals("")){
            return checkNULL;
        }
        return icon;
    }

    public String checkPicture(String picture){
        if(picture.equals("")){
            return checkNULL;
        }
        return picture;
    }

    public String checkSummaryText(String summaryText){
        if(summaryText.equals("")){
            return checkNULL;
        }
        return summaryText;
    }

    public int checkNotID(String notID){
        if(notID.equals(""))
            return 1;
        try {
            int notId = Integer.parseInt(notID);
            if (notId >= 0)
                return notId;
            else
                return 1;
        }
        catch (NumberFormatException e){
            return -1;
        }
    }
    public JSONArray checkVibrationPattern(JSONArray vibrationPattern){
        try {
            if (vibrationPattern.get(0).equals(""))
                vibrationPattern.put(0, "0");
            if (vibrationPattern.get(1).equals(""))
                vibrationPattern.put(1, "0");
            if (vibrationPattern.get(2).equals(""))
                vibrationPattern.put(2, "0");
            if (vibrationPattern.get(3).equals(""))
                vibrationPattern.put(3, "0");
        }
        catch (Exception e){
            System.out.println("JSON Exception: "+e);
        }
        return vibrationPattern;
    }

    public JSONArray checkLedColor(JSONArray ledColor){
        try {
            if (ledColor.get(0).equals(""))
                ledColor.put(0, "0");
            if (ledColor.get(1).equals(""))
                ledColor.put(1, "0");
            if (ledColor.get(2).equals(""))
                ledColor.put(2, "0");
            if (ledColor.get(3).equals(""))
                ledColor.put(3, "0");
        }
        catch (Exception e){
            System.out.println("JSON Exception: "+e);
        }
        return ledColor;
    }
}
