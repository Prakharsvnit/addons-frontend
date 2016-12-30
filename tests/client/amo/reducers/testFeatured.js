import * as actions from 'amo/actions/featured';
import featured, { initialState } from 'amo/reducers/featured';

describe('featured reducer', () => {
  it('defaults to loading', () => {
    const { loading } = featured(initialState, { type: 'unrelated' });
    assert.strictEqual(loading, false);
  });

  it('defaults to `null` addonType', () => {
    const { addonType } = featured(initialState, { type: 'unrelated' });
    assert.strictEqual(addonType, null);
  });

  it('defaults to empty results', () => {
    const { results } = featured(initialState, { type: 'unrelated' });
    assert.deepEqual(results, []);
  });

  describe('FEATURED_GET', () => {
    it('sets the initialState', () => {
      const { addonType, loading, results } = featured(
        initialState, actions.getFeatured({ addonType: 'theme' }));

      assert.equal(addonType, 'theme');
      assert.equal(loading, true);
      assert.deepEqual(results, []);
    });
  });

  describe('FEATURED_LOADED', () => {
    it('sets the results', () => {
      const entities = {
        addons: {
          bar: { slug: 'bar' },
          foo: { slug: 'foo' },
          food: { slug: 'food' },
        },
      };
      const { addonType, loading, results } = featured(
        initialState,
        actions.loadFeatured({
          addonType: 'theme',
          entities,
          result: { results: ['foo', 'food'] },
        })
      );
      assert.equal(addonType, 'theme');
      assert.strictEqual(loading, false);
      assert.deepEqual(results, [{ slug: 'foo' }, { slug: 'food' }]);
    });
  });

  describe('FEATURED_FAILED', () => {
    it('sets loading to false on failure', () => {
      const state = featured(
        initialState, actions.failFeatured({ addonType: 'theme' }));

      assert.deepEqual(state, {
        addonType: 'theme',
        loading: false,
        results: [],
      });
    });
  });
});
