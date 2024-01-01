const VOID_ELEMENTS = [
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr',
];

export default function nift(args) {
    // text node
    if (typeof args === 'string') return args;

    // [tag, props?, children]
    const tag = args[0];
    let props, children;
    if (typeof args[1] === 'string') {
        props = {};
        children = [ args[1] ];
    } else if (Array.isArray(args[1])) {
        props = {};
        children = args[1];
    } else if (typeof args[2] === 'string') {
        props = args[1] || {};
        children = [ args[2] ];
    } else {
        props = args[1] || {};
        children = args[2] || [];
    }

    const isVoid = VOID_ELEMENTS.includes(tag);
    
    let openTag = `<${tag}>`;

    if (isVoid && children.length) {
        throw new Error(`${openTag} is a void element and cannot have children.`);
    }

    const pairs = Object.entries(props);
    if (pairs.length) {
        const propsStr = (pairs
            .map(([k, v]) => `${k}="${v}"`)
            .join(' ')
        );
        openTag = `<${tag} ${propsStr}>`;
    }

    if (VOID_ELEMENTS.includes(tag)) return openTag;

    const closeTag = `</${tag}>`;
    if (!children.length) {
        return `${openTag}${closeTag}`;
    }

    const childrenStr = (children
        .map((c) => nift(c))
        .map((t) => t.split('\n').map(l => '  ' + l).join('\n'))
        // .map((t) => t.replaceAll('\n', '  \n'))
        .join('\n')
        .trim()
    );

    return `${openTag}\n  ${childrenStr}\n${closeTag}`;
}
