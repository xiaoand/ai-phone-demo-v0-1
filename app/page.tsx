import { CheckCircle2, CircleDashed, Phone, Settings2, CalendarDays, MessageSquareText } from "lucide-react";
import { envStatus } from "@/lib/env";

const steps = [
  {
    title: "Retell 电话入口",
    body: "把 Retell inbound webhook 指向 /api/retell/inbound，把 custom function 指向 /api/retell/function。",
    icon: Phone
  },
  {
    title: "预约写入",
    body: "Retell 收集姓名、电话、预约时间、事项后调用 book_appointment。",
    icon: CalendarDays
  },
  {
    title: "短信确认",
    body: "Twilio 配好时发送真实短信，未配置时写入服务端日志，便于本地演示。",
    icon: MessageSquareText
  },
  {
    title: "OpenAI 文案",
    body: "服务端用 OpenAI 生成自然确认文案，失败时自动使用确定性模板。",
    icon: Settings2
  }
];

export default function Home() {
  const status = envStatus();

  return (
    <main className="shell">
      <section className="topbar">
        <div>
          <p className="eyebrow">AI Employee Demo V0.1</p>
          <h1>AI 电话预约 Demo 控制台</h1>
        </div>
        <a className="primaryAction" href="/api/health">
          <CheckCircle2 size={18} />
          健康检查
        </a>
      </section>

      <section className="hero">
        <div className="heroCopy">
          <h2>48 小时内能拨打、能接听、能落预约的最小闭环。</h2>
          <p>
            这个项目把 Retell AI 电话、OpenAI 文案、短信确认和 Google Calendar 写入收敛到一套 Next.js 服务端接口中。
          </p>
        </div>
        <div className="callPanel">
          <p className="panelLabel">Webhook URLs</p>
          <code>/api/retell/inbound</code>
          <code>/api/retell/function</code>
          <code>/api/retell/webhook</code>
        </div>
      </section>

      <section className="grid">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <article className="stepCard" key={step.title}>
              <Icon size={22} />
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          );
        })}
      </section>

      <section className="ops">
        <div>
          <h2>配置状态</h2>
          <p>绿色代表 Demo 运行所需环境变量已存在；短信允许 console fallback。</p>
        </div>
        <div className="statusList">
          {status.map((item) => (
            <div className="statusItem" key={item.name}>
              {item.ready ? <CheckCircle2 size={18} /> : <CircleDashed size={18} />}
              <span>{item.name}</span>
              <small>{item.ready ? "ready" : "missing"}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="ops">
        <div>
          <h2>Retell Custom Function</h2>
          <p>在 Retell 后台创建函数 `book_appointment`，参数使用下面字段。</p>
        </div>
        <pre>{`{
  "customerName": "string",
  "phone": "+15551234567",
  "startsAt": "2026-08-03T10:00:00-07:00",
  "durationMinutes": 30,
  "topic": "咨询 / 看诊 / 到店服务",
  "notes": "optional"
}`}</pre>
      </section>
    </main>
  );
}
