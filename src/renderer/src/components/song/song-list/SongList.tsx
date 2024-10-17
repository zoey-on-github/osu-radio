import { Optional, Order, ResourceID, Song, SongsQueryPayload, Tag } from "../../../../../@types";
import { SearchQueryError } from "../../../../../main/lib/search-parser/@search-types";
import { namespace } from "../../../App";
import Impulse from "../../../lib/Impulse";
import { none, some } from "../../../lib/rust-like-utils-client/Optional";
import InfiniteScroller from "../../InfiniteScroller";
import SongContextMenu from "../context-menu/SongContextMenu";
import SongContextMenuItem from "../context-menu/SongContextMenuItem";
import PlayNext from "../context-menu/items/PlayNext";
import SongItem from "../song-item/SongItem";
import SongListSearch from "../song-list-search/SongListSearch";
import { songsSearch } from "./song-list.utils";
import { Component, createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";

export type SongViewProps = {
  isAllSongs?: boolean;
  isQueue?: boolean;
  playlist?: string;
};

const SongList: Component<SongViewProps> = (props) => {
  const tagsSignal = createSignal<Tag[]>([], { equals: false });
  const [tags] = tagsSignal;

  const [order, setOrder] = createSignal<Order>({ option: "title", direction: "asc" });
  const [count, setCount] = createSignal(0);

  const showSignal = createSignal(false);
  const [song, setSong] = createSignal<Song>();
  const [queryCreated, setQueryCreated] = createSignal(false);

  const [payload, setPayload] = createSignal<SongsQueryPayload>({
    view: props,
    order: order(),
    tags: tags(),
  });

  const [searchError, setSearchError] = createSignal<Optional<SearchQueryError>>(none(), {
    equals: false,
  });
  const resetListing = new Impulse();

  const searchSongs = async () => {
    const o = order();
    const t = tags();
    const parsedQuery = await window.api.request("parse::search", songsSearch());

    if (parsedQuery.type === "error") {
      setSearchError(some(parsedQuery));
      return;
    }

    setSearchError(none());
    setPayload({
      view: props,
      searchQuery: parsedQuery,
      order: o,
      tags: t,
    });
    resetListing.pulse();
  };

  onMount(() => {
    createEffect(searchSongs);
    window.api.listen("songView::reset", resetListing.pulse.bind(resetListing));
  });

  onCleanup(() => {
    window.api.removeListener("songView::reset", resetListing.pulse.bind(resetListing));
  });

  const createQueue = async (songResource: ResourceID) => {
    await window.api.request("queue::create", {
      startSong: songResource,
      ...payload(),
    });
    setQueryCreated(true);
  };

  const group = namespace.create(true);

  return (
    <div class="flex h-full flex-col">
      <div class="sticky top-0 z-10">
        <SongListSearch tags={tagsSignal} setOrder={setOrder} count={count} error={searchError} />
      </div>

      <div class="flex-grow overflow-y-auto p-5 py-0">
        <InfiniteScroller
          apiKey={"query::songsPool"}
          apiData={payload()}
          apiInitKey={"query::songsPool::init"}
          apiInitData={payload()}
          setCount={setCount}
          reset={resetListing}
          fallback={<div class="py-8 text-center text-text">No songs...</div>}
          builder={(s) => (
            <div>
              <SongItem
                song={s}
                group={group}
                onSelect={createQueue}
                showSignal={showSignal}
                setSong={setSong}
              ></SongItem>
            </div>
          )}
        />
      </div>
      <SongContextMenu show={showSignal}>
        <Show when={queryCreated() === true}>
          <PlayNext path={song()?.path} />
        </Show>

        <SongContextMenuItem
          onClick={() => {
            console.log("todo");
          }}
        >
          <p>Add to playlist</p>
          <i class="ri-add-line"></i>
        </SongContextMenuItem>
      </SongContextMenu>
    </div>
  );
};

export default SongList;
