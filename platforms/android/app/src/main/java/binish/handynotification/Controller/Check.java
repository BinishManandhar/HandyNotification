package binish.handynotification.Controller;

import org.json.JSONArray;

public class Check {
    public static String checkNULL = "NULL";

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
