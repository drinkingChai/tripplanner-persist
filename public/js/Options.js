function Options(config){
  var container = $(config.id);
  function createSection(key){
    var _options = config.options[key].reduce(function(memo, item){
      var found = config.day[key].find(function(_item){
        return _item.id === item.id;
      });
      if(!found){
        memo.push(`
          <option value='${item.id}'>
            ${ item.name }
          </option>
        `);
      }
      return memo;
    }, []);
    return `
      <li class='list-group-item'>
        ${key}
        <br />
        <select style='width: 80%' class='form-control input-sm pull-left'>
          ${_options.join('')}
        </select>
        <button data-key='${key}' class='btn btn-primary btn-sm pull-right'>+</button>
        <br clear='all' />
      </li>
      `;
  }
  var html = ['hotels', 'restaurants', 'activities'].reduce(function(memo, key){
    memo = memo += createSection(key);
    return memo;
  }, '');
  html = `
    <ul class='list-group'>
      ${ html }
    </ul>
  `;
  var $html = $(html);

  $html.on('click', 'button', function(){
    var $this = $(this);
    var key = $this.attr('data-key');
    var id = $this.prev().val()*1;
    var obj = {
      key,
      id
    };
    config.addItem(obj);
  });
  container.empty();
  container.append($html);
}
