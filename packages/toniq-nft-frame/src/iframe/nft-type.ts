export enum NftTypeEnum {
    Html = 'html',
    Json = 'json',
    Svg = 'svg',
    Text = 'text',

    Audio = 'audio',
    Image = 'image',
    Pdf = 'pdf',
    Video = 'video',
}

export const textBasedNftTypes: ReadonlyArray<NftTypeEnum> = [
    NftTypeEnum.Html,
    NftTypeEnum.Json,
    NftTypeEnum.Svg,
    NftTypeEnum.Text,
];
