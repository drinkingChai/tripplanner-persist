function Day(config){
  var container = $(config.id);
  function createSection(key){
    var lis = config.day[key].map(function(item){
      return `
        <li class='list-group-item'>
          ${item.name} 
          <button data-id='${item.id}' data-key='${key}' class='btn btn-warning btn-sm pull-right'>x</button>
          <br clear='both' />
        </li>
      `;
    });
    var template = `
      <div>
        ${key}
        <ul class='list-group'>
          ${ lis.join('') }
        </ul>
      </div>
   `;
    return template;
  }

  var html = ['hotels', 'restaurants', 'activities'].reduce(function(memo, key){
    memo = memo += createSection(key);
    return memo;
  }, '');

  var $html = $(html);
  $html.on('click', 'button', function(){
    var $this = $(this);
    config.onRemoveItem({
      id: $this.attr('data-id')*1,
      key: $this.attr('data-key')
    });
  });
  container.empty();
  container.append($html);
}
