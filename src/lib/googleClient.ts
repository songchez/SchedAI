import { google } from "googleapis";
import { prisma } from "@/lib/prisma";

// 엑세스 토큰 기반 구글 캘린더 클라이언트 생성
export async function createGoogleCalendarClient(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider: "google",
    },
  });

  if (!user || !user.accessToken) {
    throw new Error("No access token available");
  }
  if (!account) {
    throw new Error("어카운트가 없습니다");
  }

  const oauth2Client = createOAuthClient();

  // Access Token이 만료되었으면 갱신
  if (!account.expiresAt || account.expiresAt < Math.floor(Date.now() / 1000)) {
    const newAccessToken = await refreshAccessToken(userId);
    oauth2Client.setCredentials({ access_token: newAccessToken });
  } else {
    oauth2Client.setCredentials({ access_token: user.accessToken });
  }

  return google.calendar({ version: "v3", auth: oauth2Client });
}

//
export async function createGoogleAuthClient(accessToken: string) {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  auth.setCredentials({ access_token: accessToken });
  return google.calendar({ version: "v3", auth });
}

export function createOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

export async function getAccessToken(authCode: string) {
  const oauth2Client = createOAuthClient();
  const { tokens } = await oauth2Client.getToken(authCode);
  return tokens;
}

export async function refreshAccessToken(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || !user.accessToken) {
    throw new Error("Refresh token not found");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({ refresh_token: user.refreshToken });

  const { credentials } = await oauth2Client.refreshAccessToken();

  // 새 Access Token을 Prisma에 저장
  await prisma.user.update({
    where: { id: userId },
    data: { accessToken: credentials.access_token },
  });

  return credentials.access_token;
}

export async function getCalendarList(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: "v3", auth });
  const response = await calendar.calendarList.list();
  return response.data.items || [];
}

export async function getCalendarEvents(
  calendarId: string,
  accessToken: string
) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: "v3", auth });
  const response = await calendar.events.list({
    calendarId,
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });

  return response.data.items || [];
}

export async function addEventToCalendar(
  calendarId: string,
  eventDetails: any,
  accessToken: string
) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: "v3", auth });
  const response = await calendar.events.insert({
    calendarId,
    requestBody: eventDetails,
  });

  return response.data;
}
