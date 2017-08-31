function DayPicker(config){
  var container = $(config.id);
  var lis = config.days.map(function(day, index){
    return `
      <li class='${ config.idx === index ? 'active': ''}'>
        <a>
          ${index + 1}
        </a>
      </li>`; 
  });
  var template = ` 
    <div class='panel panel-heading'>
      <button class='btn btn-primary btn-sm'>Add Day</button>
      <button class='btn btn-warning btn-sm'>Remove Day</button>
    </div>
    <div class='panel-body'>
      <ul class='nav nav-tabs'>
        ${ lis.join('') }
      </ul>
    </div>
  `;
  var html = $(template);
  html.on('click', 'li', function(){
    var $this = $(this);
    config.selectDay($this.index());
  });

  html.on('click', '.btn-primary', function(){
    config.addDay();
  });
  
  html.on('click', '.btn-warning', function(){
    config.removeDay();
  });

  container.empty();
  container.append(html);
}
