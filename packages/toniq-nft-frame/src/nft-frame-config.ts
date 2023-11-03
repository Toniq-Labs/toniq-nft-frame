import {Overwrite, getObjectTypedKeys, pickObjectKeys} from '@augment-vir/common';
import {TemplateResult} from 'element-vir';
import {Writable} from 'type-fest';
import {defaultFrameStylesExtraHtml} from './default-styles/default-frame-styles';
import {Dimensions} from './util/dimensions';

export const defaultNftConfig = {
    nftUrl: '' as string,
    /**
     * URL for the child NFT iframe. If none are provided, this defaults to Toniq Lab's own NFT
     * iframe URL.
     */
    childFrameUrl: '' as string,
    /** The max NFT size constraints which the NFT will be resized to fit within. */
    max: undefined as Dimensions | undefined,
    /** The min NFT size constraints which the NFT will be resized to fit within. */
    min: undefined as Dimensions | undefined,
    /** How long to wait for the nft to load before calculating size. Defaults to 500 milliseconds. */
    loadWaitDuration: {
        milliseconds: 500,
    },
    /** For hard-coding the final NFT size. Setting this can cause distortions. */
    forcedFinalNftSize: undefined as Dimensions | undefined,
    /**
     * This force the NFT's dimensions instead of trying to automatically detect the NFT's
     * dimensions.
     */
    forcedOriginalNftSize: undefined as Dimensions | undefined,
    /**
     * An HTML string that will be interpolated into the child NFT iframe. For any operations that
     * need to run before size calculations are completed, wrap them in a globally defined function
     * named executeBeforeSize inside a <script> element.
     *
     * Defaults to defaultFrameStylesExtraHtml.bioniq. To turn off this default, assign something
     * explicitly to this property (undefined, empty string, a string with actual contents etc.).
     */
    extraHtml: defaultFrameStylesExtraHtml.bioniq as string | undefined | TemplateResult,
    /** Query selector to use to determine an html result's size. */
    htmlSizeQuerySelector: undefined as string | undefined,
    /**
     * When set to true, videos will not auto play their video (audio is always programmatically
     * muted).
     */
    blockAutoPlay: undefined as boolean | undefined,
    /** Block interaction with NFTs, even on HTML pages. */
    blockInteraction: undefined as boolean | undefined,
    /** Set to true to allow scrolling of text and HTML NFT types. */
    allowScrolling: undefined as boolean | undefined,
    /** Set to true to disable lazy loading. */
    eagerLoading: undefined as boolean | undefined,
    /** Timeout for each loading phase in milliseconds. Defaults to 10 milliseconds. */
    timeoutDuration: {
        milliseconds: 10_000,
    },
    /**
     * Set this to true to block usage of the persistent cache, which lasts longer than a single
     * session. Settings this to true will negatively impact performance but will make sure NFTs are
     * up to date.
     */
    blockPersistentCache: undefined as boolean | undefined,
    /** Set this to true to prevent removal of console method calls inside of the child iframe. */
    allowConsoleLogs: undefined as boolean | undefined,
    hideError: undefined as boolean | undefined,
} as const;

type RequiredConfigKeys = 'nftUrl' | 'childFrameUrl';

export type NftFrameConfig = Writable<
    Overwrite<
        Partial<typeof defaultNftConfig>,
        Required<Pick<typeof defaultNftConfig, RequiredConfigKeys>>
    >
>;

/**
 * All values with defaults are no longer possibly undefined in this type (because they will always
 * have a value).
 */
export type InternalDefaultedNftFrameConfig = Overwrite<
    NftFrameConfig,
    {
        [Prop in keyof typeof defaultNftConfig as undefined extends (typeof defaultNftConfig)[Prop]
            ? never
            : Prop]: (typeof defaultNftConfig)[Prop];
    }
>;

export function toChildNftConfig(
    NftConfig: InternalDefaultedNftFrameConfig & Record<PropertyKey, unknown>,
) {
    /**
     * Use pickObjectKeys a filter on the keys (rather than omitObjectKeys directly) to ensure that
     * we only pick expected keys, in case external sources include unexpected keys.
     */
    return pickObjectKeys(
        NftConfig,
        getObjectTypedKeys(defaultNftConfig).filter(
            (key): key is keyof InternalDefaultedNftFrameConfig =>
                // don't send the child frame url to the frame
                key !== 'childFrameUrl',
        ),
    );
}

export type NftConfigForChildIframe = ReturnType<typeof toChildNftConfig>;
