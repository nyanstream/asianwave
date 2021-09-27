import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const Options = () => {
    const [text, setText] = useState('test');

    useEffect(() => {
        setTimeout(() => {
            setText('aaaa');
        }, 2000);
    }, []);

    return <div>{text}</div>;
};

export default <Options />;
