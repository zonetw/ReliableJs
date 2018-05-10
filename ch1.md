#1.1.1
## 使用 duck typing

## 在 JS 中, this 提供一個設計的機會, 請使用它
 以 getX.call(this, d, i) 為例:
 --讓 this 的 scope 限定在 line 這個函式當中, 確保 getX 這個函式由 line 函式外部定義時, 也能夠像是在 line 內部定義一般地使用--
藉由使用 this 作為接點, 讓使用者可以動態地去切換以及組合

lineGenerator = rj3.svg.line().y(function(d){ return 100 - this.getValue(d);})

priceGrapher1 = {
    lineGenerator: lineGenerator,
    getValue: function(year){
        return year - 2010;
    }
}

priceGrapher2 = {
    lineGenerator: lineGenerator,
    getValue: function(month){
        return month/12;
    }
}

Q: 另一種策略模式的實作方式?

#1.1.2 在大型系統中避免 JS 陷阱
1. 腳本不是模組
>  要注意作用域, 就算分成不同的 js, 沒有隔開作用域的話, 這些 js 合在一起來是會互相影響

2. 活用作用域讓系統保持控制
3. 契約編程

#1.1.3 應用軟體工程原則
SOLID 原則
單一責任(SRP)
分離關注點: 一個類或者函式, 只應該有一個引起它變化的原因

開放封閉(OCP)
`里氏代換`
`接口隔離`
`依賴反轉`

DRY 原則
不要到處重複 > 對 JS 來說很重要

#1.2 編寫保持正確的代碼
投資單元測試
實踐 TDD
編寫容易測試的代碼 > 這邊分離關注點的例子很棒






