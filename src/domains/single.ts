import { Remesh } from "remesh";
import { AsyncModule } from "remesh/modules/async";
import { of } from "rxjs";
import { filter, map, take, tap } from "rxjs/operators";

const dict = {
    'en': 'world',
    'zh': '世界',
}
type Lang = keyof typeof dict
const SingleDataDomain = Remesh.domain({
    name: 'SingleDataDomain',
    impl: (domain, lang: Lang = 'en') => {
        const NameAsyncModule = AsyncModule(domain, {
            name: 'NameAsyncModule',
            load: async ({ get }, noarg: void) => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return {
                    name: dict[lang]
                }
            }
        });
        domain.effect({
            name: 'LoadNameEffect',
            impl: ({ get, fromQuery, fromEvent }) => {
                return of([NameAsyncModule.command.LoadCommand()])
            },
        });

        const LoadedNameQuery = domain.query({
            name: 'LoadedNameQuery',
            impl: ({ get }) => {
                const asyncData = get(NameAsyncModule.query.AsyncDataQuery());
                if (asyncData.type !== 'success') {
                    return 'unknown'
                }
                return asyncData.value.name;
            },
        });

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
                NameAsyncDataQuery: NameAsyncModule.query.AsyncDataQuery,
                NameThreeTimesQuery,
                LoadedNameQuery,
            },
            event: {
                LoadedEvent: NameAsyncModule.event.SuccessEvent,
                GotNameEvent,
            }
        }
    },
});
export { SingleDataDomain };
