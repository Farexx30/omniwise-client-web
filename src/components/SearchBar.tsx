
interface SearchBarProps {
    searchValue?: string;
    onSearch: (query: string) => void;
    placeholder?: string;
}

export default function SearchBar({ searchValue, onSearch, placeholder }: SearchBarProps) {
    return (
        <div className="search-bar">
            <div>
                <img
                    src="/search-icon.svg"
                    alt="Search Icon"
                />

                <input
                    type="text"
                    value={searchValue}
                    onChange={event => onSearch(event.target.value)}
                    placeholder={placeholder}
                />
            </div>
        </div>
    )
}