import React, { useEffect, useState, useRef } from 'react';
import { Search, ChevronDown, LayoutGrid, Ship, Plane, Building2, X } from 'lucide-react';
import api from '../lib/api';

const categories = [
  { key: '', label: 'All', icon: LayoutGrid },
  { key: 'sea_port', label: 'Sea Ports', icon: Ship },
  { key: 'airport', label: 'Airports', icon: Plane },
  { key: 'icd_other', label: 'ICD And Others', icon: Building2 },
];

export default function CustomsLocationSelector({ selectedLocations = [], onChange }) {
  const [locations, setLocations] = useState([]);
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const [selected, setSelected] = useState(selectedLocations || []);

  useEffect(() => {
    fetchLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, query]);

  useEffect(() => {
    setSelected(selectedLocations || []);
  }, [selectedLocations]);

  async function fetchLocations() {
    try {
      const res = await api.get('/customs-locations', { params: { category, search: query } });
      if (res.data && res.data.data) setLocations(res.data.data);
    } catch (err) {
      console.error(err);
    }
  }

  function toggleLocation(loc) {
    const exists = selected.find((s) => s.code === loc.code);
    let next;
    if (exists) next = selected.filter((s) => s.code !== loc.code);
    else next = [...selected, { name: loc.name, code: loc.code }];
    setSelected(next);
    onChange && onChange(next);
    console.log('CustomsLocationSelector toggleLocation -> selected:', next);
    setOpen(false);
  }

  function removeCode(code) {
    const next = selected.filter((s) => s.code !== code);
    setSelected(next);
    onChange && onChange(next);
    console.log('CustomsLocationSelector removeCode -> selected:', next);
  }

  function selectAllVisible(e) {
    const checked = e.target.checked;
    if (checked) {
      const toAdd = locations
        .filter((l) => !selected.find((s) => s.code === l.code))
        .map((l) => ({ name: l.name, code: l.code }));
      const next = [...selected, ...toAdd];
      setSelected(next);
      onChange && onChange(next);
      console.log('CustomsLocationSelector selectAllVisible -> selected (checked):', next);
    } else {
      // remove any that are in current filtered locations
      const codes = new Set(locations.map((l) => l.code));
      const next = selected.filter((s) => !codes.has(s.code));
      setSelected(next);
      onChange && onChange(next);
      console.log('CustomsLocationSelector selectAllVisible -> selected (unchecked):', next);
    }
  }

  // When backend may still have old category values, map icd_other to both icd_port and land_port
  const filtered = category === ''
    ? locations
    : category === 'icd_other'
      ? locations.filter((l) => l.category === 'icd_port' || l.category === 'land_port' || l.category === 'icd_other')
      : locations.filter((l) => l.category === category);

  const activeCategory = categories.find((c) => c.key === category) || categories[0];
  const activeCategoryLabel = activeCategory.label;
  const ActiveCategoryIcon = activeCategory.icon;
  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-4">
        {categories.map((c) => (
          <button
            key={c.label}
            onClick={() => setCategory(c.key)}
            className={`px-4 py-2 rounded-md border ${category === c.key ? 'bg-navy-800 text-white' : 'bg-white text-navy-800'}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-3">
        <label className="text-sm font-medium text-navy-800">Choose Customs Location<span className="text-red-500">*</span></label>
        <div ref={containerRef} className="flex-1 relative">
          <div className="flex items-center border rounded-md px-2 py-1">
            <Search className="text-navy-800 mr-2" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Location"
              className="w-full outline-none"
            />
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 px-2"
              type="button"
            >
              <ActiveCategoryIcon size={16} />
              <span>{activeCategoryLabel}</span>
              <ChevronDown size={16} />
            </button>
          </div>

          {open && (
            <div className="absolute left-0 mt-1 w-full bg-white border rounded-md z-40">
              <ul>
                {categories.map((c) => {
                  const Icon = c.icon;
                  return (
                    <li
                      key={c.label}
                      className={`px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 ${category === c.key ? 'bg-gray-50 font-medium' : ''}`}
                      onClick={() => {
                        setCategory(c.key);
                        setOpen(false);
                      }}
                    >
                      <Icon size={16} />
                      <span>{c.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Results list below the search input */}
          <div className="absolute left-0 mt-1 w-full z-30">
            <div className="bg-white border rounded-md shadow-md max-h-56 overflow-auto">
              <ul>
                {filtered && filtered.length > 0 ? (
                  filtered.map((loc) => (
                    <li
                      key={loc.code}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1"
                        onClick={() => { toggleLocation(loc); }}
                    >
                      <div>
                        <div className="font-medium text-navy-800">{loc.name}</div>
                        <div className="text-xs text-gray-500">{loc.code}</div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-sm text-gray-500">No locations found</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* click-outside handler */}
        {/* close dropdown when clicking outside the container */}
        {typeof document !== 'undefined' && (
          <CloseDropdownOnOutsideClick containerRef={containerRef} setOpen={setOpen} />
        )}

        <div className="flex items-center gap-2">
          <input id="selectAll" type="checkbox" onChange={selectAllVisible} />
          <label htmlFor="selectAll" className="text-sm">Select All</label>
        </div>
      </div>

      {/* Selected tags area placed below dropdown/search. Click tag to toggle/deselect. */}
      <div className="mb-3 mt-2 relative z-10">
        <div className="flex flex-wrap gap-2">
          {selected.map((s) => (
            <button
              key={s.code}
              type="button"
              onClick={() => toggleLocation({ name: s.name, code: s.code })}
              className="px-3 py-1 border rounded-md bg-white text-navy-800 hover:bg-gray-50 whitespace-normal"
              title={`${s.name}(${s.code})`}
            >
              {`${s.name}(${s.code})`}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm text-navy-800">Total no. of selected locations: {selected.length}</div>
    </div>
  );
}

  function CloseDropdownOnOutsideClick({ containerRef, setOpen }) {
    useEffect(() => {
      function handleClick(e) {
        const el = containerRef && containerRef.current;
        if (!el) return;
        if (!el.contains(e.target)) setOpen(false);
      }
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, [containerRef, setOpen]);

    return null;
  }
