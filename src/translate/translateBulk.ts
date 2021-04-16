import hasChinese from "../support/hasChinese";
import translateText, { TranslateOptions } from "./translateText";

const charsLimit = 2000;

export default async function translateBulk<T>({
  values,
  getText,
  setText,
  translatedPrefix = "[中] ",
  translateOptions,
}: {
  values: T[];
  getText: (input: T) => string;
  setText: (input: T, text: string) => void;
  translatedPrefix?: string;
  translateOptions?: TranslateOptions;
}) {
  let length = 0;
  let chunk = "";
  let writebacks: ((text: string) => void)[] = [];

  async function flush() {
    if (!chunk) {
      return;
    }
    const result = await translateText(chunk.trim(), translateOptions);
    const translated = result.split(/\n/g);
    for (let i = 0; i < translated.length; ++i) {
      writebacks[i](translatedPrefix + translated[i]);
    }

    length = 0;
    chunk = "";
    writebacks = [];
  }

  for (let index = 0; index < values.length; ++index) {
    const value = values[index];
    const raw = getText(value);
    if (!hasChinese(raw)) {
      continue;
    }
    length += raw.length;
    chunk += raw + "\n";
    writebacks.push((translated) => setText(value, translated));
    if (length >= charsLimit) {
      await flush();
    }
  }
  await flush();
  return values;
}

if (require.main === module) {
  const tuples: { name: string; desc: string }[] = [
    {
      name: "apollo",
      desc:
        "（阿波罗）是携程框架部门研发的分布式配置中心，能够集中化管理应用不同环境、不同集群的配置，配置修改后能够实时推送到应用端，并且具备规范的权限、流程治理等特性，适用于微服务配置管理场景。",
    },
    {
      name: "JavaGuide",
      desc:
        "「Java学习+面试指南」一份涵盖大部分 Java 程序员所需要掌握的核心知识。准备 Java 面试，首选 JavaGuide！",
    },
    {
      name: "mall",
      desc:
        "mall项目是一套电商系统，包括前台商城系统及后台管理系统，基于SpringBoot+MyBatis实现，采用Docker容器化部署。 前台商城系统包含首页门户、商品推荐、商品搜索、商品展示、购物车、订单流程、会员中心、客户服务、帮助中心等模块。 后台管理系统包含商品管理、订单管理、会员管理、促销管理、运营管理、内容管理、统计报表、财务管理、权限管理、设置等模块。",
    },
    {
      name: "jeecg-boot",
      desc:
        "「企业级低代码平台」前后端分离架构SpringBoot 2.x，SpringCloud，Ant Design&Vue，Mybatis-plus，Shiro，JWT。强大的代码生成器让前后端代码一键生成，无需写任何代码! 引领新的开发模式OnlineCoding->代码生成->手工MERGE，帮助Java项目解决70%重复工作，让开发更关注业务，既能快速提高效率，帮助公司节省成本，同时又不失灵活性。",
    },
  ];
  translateBulk({
    values: tuples,
    getText: (t) => t.desc,
    setText: (t, text) => (t.desc = text),
  })
    .then(console.info)
    .catch(console.error);
}
