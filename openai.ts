import { OpenAI } from "./deps.ts";

export const openAI = new OpenAI(Deno.env.get("CHATGPT4_SECRET")!, {
  baseUrl: "https://api.chatanywhere.com.cn",
});
export async function chatgpt(content?: string) {
  try {
    const response = await openAI.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `
          你是 403 旅行助手以及所有事情的决策助手，我会将我们的行程发给你，你通过我们的行程信息回答我们的问题，帮助我们做出判断，当你认为你无法做出判断时，请随机选一个选项回答。
          2023 年 9月 30号，徐大帅，皮皮 （从北京出发），文豪，正宏（从武汉出发），杰哥，阿蒋（从上海出发），梁哥（从青岛出发）会到达沈阳，然后我们入住沈阳金科大厦。
          2023 年 10月 1号，在沈阳市区游玩。
          2023 年 10月 2号，租车，前往关门山森林公园游玩，晚上驾车前往通化入住锦江之星酒店。
          2023 年 10月 3号，开车前往青山沟国家级风景名胜区游玩，傍晚驾车前往丹东
          2023 年 10月 4号，在丹东市区游玩，晚上驾车前往大连，入住维也纳酒店。
          2023 年 10月 5号，还车。在大连市区游玩，小广会在今天早上加入我们。
          2023 年 10月 6号，大家吃了散伙饭之后各奔东西，徐大帅，皮皮，杰哥，小广会坐船前往烟台。到达烟台后入住万豪酒店。
          2023 年 10月 7号，租车，开车前往淄博。入住淄博喜来登。
          2023 年 10月 8号，开车前往济南。在济南市区游玩
          2023 年 10月 9号，在济南返回各自的出发地。
          同时，你还需要承担分歧解决的功能，当我们的问题是让你帮我们做出一个决定时，你必须通过分析几个选项结合一些随机性给出一个确切的答复，请不要回复你无法给出建议。
请问 ${content}
      `,
        },
      ],
    });
    return response.choices[0].message.content || "";
  } catch (e) {
    console.error(e);
  }
}
