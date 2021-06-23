import prepareUrl from "libs/prepareUrl";
import { ArticlesTypes } from "modules/articles/types";

const createTextEnhancer = (name, payload) => `#text-enhancer:${name}:${payload}#`;
const articlesAcrossLine = Object.values(ArticlesTypes).join("|");

const getArticlesRegExp = (code) => new RegExp(`#(${articlesAcrossLine}):${code}#`, "g");
const articlesRegExp = new RegExp(`(${articlesAcrossLine})`, "g");

class EnhancersConverter {
  convert(text, template, { name, payloadData }) {
    return text.replace(template, createTextEnhancer(name, payloadData));
  }
}

class EnhancersConverterReadAlso extends EnhancersConverter {
  convert(text, articlesData) {
    articlesData.forEach((articlesDataItem) => {
      const template = getArticlesRegExp(articlesDataItem.code);
      const [articleType] = text.match(template);

      text = super.convert(text, template, {
        name: "ReadAlso",
        payloadData: this.createPayloadData(articlesDataItem, articleType.match(articlesRegExp)[0]),
      });
    });

    return text;
  }

  createPayloadData({ announceImageUrl, title, code }, path) {
    return JSON.stringify({
      image: announceImageUrl ? prepareUrl(announceImageUrl) : null,
      imageAspectRatio: 1.6,
      text: title,
      reference: prepareUrl(`/${path}/${code}`),
    });
  }
}

export default new EnhancersConverterReadAlso();
