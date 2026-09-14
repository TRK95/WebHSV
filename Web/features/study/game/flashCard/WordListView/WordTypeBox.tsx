function WordTypeBox(props: {type: string, icon: JSX.Element, color: string, backgroundColor: string, wordTypeList: any[]}) {
    const {type, icon, color, backgroundColor, wordTypeList} = props
    return (  
        <div key={type} className="word-list-view-type-item" style={{color: `${color}`}}>
            <div className="word-type-item-number">
                {icon}
                <span>{wordTypeList.length}</span>
            </div>
            <div className="word-type-item-name" style={{backgroundColor: `${backgroundColor}`}}>
                {type}
            </div>
        </div>
    );
}

export default WordTypeBox;