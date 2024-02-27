import React, { memo, useEffect } from 'react';

type Props = {
    content: string;
    viewFlag: boolean;
    setViewFlag: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DialogComponent = memo(function Dialog(props: Props) {
    const { viewFlag, setViewFlag } = props;
    useEffect(() => {
        const registerBackgroundFixed = () => {
            const body = document.body;
            const scrollWidth = window.innerWidth - body.clientWidth;
            body.style.marginRight = `${scrollWidth}px`;
            body.style.overflowY = 'hidden';
        };
        const unRegisterBackgroundFixed = () => {
            const body = document.body;
            body.style.overflowY = '';
            body.style.marginRight = '';
        };
        if (viewFlag) registerBackgroundFixed();

        return () => {
            unRegisterBackgroundFixed();
        };
    }, [viewFlag]);

    const onClickBackground = () => {
        setViewFlag(false);
    };

    const onClickCard = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
    };

    return (
        <>
            <div
                className={
                    'fixed flex flex-col items-center justify-center overflow-hidden bg-gray-500/50 transition-all ' +
                    (viewFlag
                        ? ' top-0 left-0 h-screen w-screen '
                        : ' top-1/2 left-1/2 h-0 w-0 ')
                }
                onClick={onClickBackground}
            >
                <div className="relative h-3/4 w-3/4 max-w-3xl overflow-y-scroll">
                    <div
                        id="policy"
                        className="flex w-full min-h-full flex-col bg-white text-black p-4"
                        onClick={onClickCard}
                        dangerouslySetInnerHTML={{ __html: props.content }}
                    >
                    </div>
                </div>
            </div>
        </>
    );
}); 