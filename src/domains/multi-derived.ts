import { Remesh } from "remesh"
import { MonoTypeOperatorFunction } from "rxjs";
import { filter, map, take, tap } from "rxjs/operators";
import { BaseDomain, Lang } from "./multi-base";

const DerivedDomain = Remesh.domain({
    name: 'DerivedDomain',
    impl: (domain, lang: Lang) => {
        const baseDomain = domain.getDomain(BaseDomain(lang))

        const { NameAsyncDataQuery, LoadedNameQuery } = baseDomain.query
        const { LoadedEvent } = baseDomain.event

        const GotNameEvent = domain.event<string>({
            name: 'GotNameEvent',
        });
        const RelatedDataState = domain.state({
            name: 'RelatedDataState',
            default: '',
        });
        const ChangeRelatedDataCommand = domain.command({
            name: 'ChangeRelatedDataCommand',
            impl: ({ get }, arg: string) => {
                return [RelatedDataState().new(`${arg}${arg}${arg}`), GotNameEvent(arg)]
            },
        });
        const NameThreeTimesQuery = domain.query({
            name: 'NameThreeTimesQuery',
            impl: ({ get }) => {
                return get(RelatedDataState());
            },
        });

        domain.effect({
            name: 'SetFirstTimeLoadedDataEffect',
            impl: ({ get, fromQuery, fromEvent }) => {
                return fromQuery(LoadedNameQuery())
                    .pipe(tap((a) => console.log('name tap1', a)))
                    .pipe(filter((name) => name !== 'unknown'))
                    .pipe(tap((a) => console.log('name tap2', a)))
                    .pipe(take(1))
                    .pipe(tap((a) => console.log('name tap3', a)))
                    .pipe(map((name) => {
                        return [ChangeRelatedDataCommand(name)];
                    }))
            },
        });

        return {
            query: {
                NameAsyncDataQuery,
                NameThreeTimesQuery,
            },
            event: {
                LoadedEvent,
                GotNameEvent,
            }
        }
    },
});
export { DerivedDomain };