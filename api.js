// api.js
import axios from "axios";
import CryptoJS from "crypto-js";
import { sleep } from "./utils.js";

const API_URL = "http://127.0.0.1:3000/device/real/query";
const TOKEN = "interview_token_123";
const MAX_RETRIES = 3;

function generateSignature(url, token, timestamp) {
  const raw = url + token + timestamp;
  return CryptoJS.MD5(raw).toString();
}

export async function fetchDeviceBatch(serialNumbers, attempt = 1) {
  const timestamp = Date.now().toString();
  const signature = generateSignature(API_URL, TOKEN, timestamp);

  try {
    const response = await axios.post(
      API_URL,
      { serialNumbers },
      {
        headers: {
          Signature: signature,
          Timestamp: timestamp,
          Token: TOKEN
        }
      }
    );

    return response.data;
  } catch (error) {
    if (
      (error.response?.status === 429 || !error.response) &&
      attempt <= MAX_RETRIES
    ) {
      console.warn(`Retrying batch... attempt ${attempt}`);
      await sleep(1000);
      return fetchDeviceBatch(serialNumbers, attempt + 1);
    }

    throw error;
  }
}
