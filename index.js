/* eslint-disable comma-dangle */
/* eslint-disable semi */
/* eslint-disable quotes */
/* eslint-disable no-useless-return */
import "dotenv/config";
import linebot from "linebot";
import axios from "axios";

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});

bot.on("message", async (event) => {
  if (event.message.type === "text") {
    try {
      const { data } = await axios.get(
        "https://media.taiwan.net.tw/XMLReleaseALL_public/scenic_spot_C_f.json"
      );
      const infos = data.XML_Head.Infos.Info;
      infos.forEach((info) => {
        if (info.Name.includes(event.message.text)) {
          event.reply([
            info.Name,
            info.Description,
            {
              type: "location",
              title: info.Name,
              address: info.Add,
              latitude: info.Py,
              longitude: info.Px,
            },
          ]);
          return;
        }
      });
      event.reply("找不到");
    } catch (error) {
      console.log(error);
      event.reply("發生錯誤");
    }
  }
});

bot.listen("/", process.env.PORT || 3000, () => {
  console.log("機器人啟動");
});
