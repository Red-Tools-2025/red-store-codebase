import { Twilio } from "twilio";
import { TWILIO_ACCOUNT_AUTH_TOKEN, TWILIO_ACCOUNT_SID } from "./env";

const twilioClient = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_ACCOUNT_AUTH_TOKEN);
export default twilioClient;
