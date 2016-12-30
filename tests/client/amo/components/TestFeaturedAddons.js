import React from 'react';
import {
  renderIntoDocument,
  findRenderedComponentWithType,
} from 'react-addons-test-utils';
import { findDOMNode } from 'react-dom';
import { Provider } from 'react-redux';

import * as featuredActions from 'amo/actions/featured';
import {
  FeaturedAddonsBase,
  mapStateToProps,
} from 'amo/components/FeaturedAddons';
import createStore from 'amo/store';
import { ADDON_TYPE_EXTENSION, ADDON_TYPE_THEME } from 'core/constants';
import I18nProvider from 'core/i18n/Provider';
import { fakeAddon } from 'tests/client/amo/helpers';
import { getFakeI18nInst } from 'tests/client/helpers';


describe('<FeaturedAddons />', () => {
  const initialState = { api: { clientApp: 'android', lang: 'en-GB' } };

  function render({ ...props }) {
    return findDOMNode(findRenderedComponentWithType(renderIntoDocument(
      <Provider store={createStore(initialState)}>
        <I18nProvider i18n={getFakeI18nInst()}>
          <FeaturedAddonsBase i18n={getFakeI18nInst()} {...props} />
        </I18nProvider>
      </Provider>
    ), FeaturedAddonsBase));
  }

  it('renders a FeaturedAddons page with no add-ons set', () => {
    const store = createStore(initialState);
    store.dispatch(
      featuredActions.getFeatured({ addonType: ADDON_TYPE_EXTENSION }));
    const root = render(mapStateToProps(store.getState()));

    assert.include(root.textContent, 'More Featured Extensions');
  });

  it('renders a FeaturedAddons page with themes HTML', () => {
    const store = createStore(initialState);
    store.dispatch(
      featuredActions.getFeatured({ addonType: ADDON_TYPE_THEME }));
    const root = render(mapStateToProps(store.getState()));

    assert.include(root.textContent, 'More Featured Themes');
  });

  it('renders each add-on when set', () => {
    const store = createStore(initialState);
    store.dispatch(featuredActions.loadFeatured({
      addonType: ADDON_TYPE_EXTENSION,
      entities: {
        addons: {
          howdy: {
            ...fakeAddon, name: 'Howdy', slug: 'howdy',
          },
          'howdy-again': {
            ...fakeAddon, name: 'Howdy again', slug: 'howdy-again',
          },
        },
      },
      result: { results: ['howdy', 'howdy-again'] },
    }));
    const root = render(mapStateToProps(store.getState()));

    assert.deepEqual(
      Object.values(root.querySelectorAll('.SearchResult-heading'))
        .map((heading) => heading.textContent),
      ['Howdy', 'Howdy again']
    );
  });

  it('throws if add-on type is not supported', () => {
    assert.throws(() => {
      render({ addonType: 'XUL' });
    }, 'Invalid addonType: "XUL"');
  });
});
