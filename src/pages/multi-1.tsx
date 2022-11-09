import { useRemeshDomain, useRemeshEvent, useRemeshQuery } from "remesh-react"
import { BaseDomain } from "../domains/multi-base"
import { DerivedDomain } from "../domains/multi-derived"

export default function Page() {
    const baseDomain = useRemeshDomain(BaseDomain('zh'))
    const drivedDomain = useRemeshDomain(DerivedDomain('zh'))
    // const asyncData = useRemeshQuery(drivedDomain.query.NameAsyncDataQuery())
    const loadedName = useRemeshQuery(baseDomain.query.LoadedNameQuery())
    console.log('about to run useRemeshEvent')
    useRemeshEvent(drivedDomain.event.GotNameEvent, (name) => {
        alert('name successfully loaded: hello, ' + name + '!')
    })
    const nameNameName = useRemeshQuery(drivedDomain.query.NameThreeTimesQuery())
    // if (asyncData.type !== 'success') {
    //     return <p>hello, {loadedName}! loading... please wait</p>
    // }
    return <p>hello, {loadedName}! - {nameNameName}</p>
}