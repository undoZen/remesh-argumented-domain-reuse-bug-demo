import { useRemeshDomain, useRemeshEvent, useRemeshQuery } from "remesh-react"
import { SingleDataDomain } from "../domains/single"

export default function Page() {
    const someDomain = useRemeshDomain(SingleDataDomain('zh'))
    const asyncData = useRemeshQuery(someDomain.query.NameAsyncDataQuery())
    const loadedName = useRemeshQuery(someDomain.query.LoadedNameQuery())
    useRemeshEvent(someDomain.event.GotNameEvent, (name) => {
        alert('name successfully loaded: hello, ' + name + '!')
    })
    const nameNameName = useRemeshQuery(someDomain.query.NameThreeTimesQuery())
    if (asyncData.type !== 'success') {
        return <p>hello, {loadedName}! loading... please wait</p>
    }
    return <p>hello, {loadedName}! - {nameNameName}</p>
}