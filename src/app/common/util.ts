import * as moment from 'moment';

/**
 * This class contains utility functions.
 */
export class Util {

    /**
     * Handy method to format a date string to the specified format. Please see 
     * Moment.js website to the possible formats :
     * https://momentjs.com/docs/#/displaying/
     * 
     * The optional parameter "sourceFormat" should be provided if the date 
     * string input has a Non-ISO format. For more information  please refer to 
     * https://stackoverflow.com/questions/39969570/deprecation-warning-in-moment-js
     * 
     * @param dateStr 
     * @param outputformat The format of the output date string.
     * @param sourceFormat The format of the source if its Non-ISO. This is 
     *                     Optional.
     */
    static formatDateTime(dateStr:string,outputformat:string,sourceFormat?:string) {  
        if (!dateStr || dateStr == "") {
            return "";
        }           
        let date: moment.Moment;
        if (sourceFormat) {
            date = moment(dateStr,sourceFormat);
        } else {
            date = moment(dateStr);
        }
                
        return date.format(outputformat);
    }

    /**
     * Returns a "null" string if the value pass have empty string or null 
     * object. Otherwise it will return the value string.
     * 
     * @param value 
     */
    static toNullString(value:string): string{
        var returnValue = "";
        if (!value ||
            value == "")  {
            returnValue = "null";        
        } else {
            returnValue = value;                    
        }
        return returnValue;
    }

    /**
     * Returns either the passed in String, or if the String is null, an empty 
     * String ("").
     * 
     * @param value 
     */
    static defaultString(value:string): string {
        var returnValue = "";
        if (value)  {            
            returnValue = value;                    
        }
        return returnValue;
    }
}